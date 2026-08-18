/**
 * Auditoria append-only con integridad (U7).
 *
 * Cada evento encadena su hash con el del evento anterior (cadena de hashes),
 * de modo que reescribir, borrar o reordenar cualquier evento rompe la cadena
 * y `verify()` lo detecta. La API solo permite `append`/`list`/`verify`; no hay
 * update ni delete (append-only por diseno).
 */

import { createHash, randomUUID } from "node:crypto";

export interface AuditEvent {
  seq: number;
  id: string;
  at: string; // ISO
  actor: string;
  action: string;
  subject: string;
  prevHash: string;
  hash: string;
}

export interface AuditEntry {
  actor: string;
  action: string;
  subject: string;
  at?: string;
}

const GENESIS = "genesis";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function eventHash(e: {
  seq: number;
  id: string;
  at: string;
  actor: string;
  action: string;
  subject: string;
  prevHash: string;
}): string {
  return sha256(`${e.seq}|${e.id}|${e.at}|${e.actor}|${e.action}|${e.subject}|${e.prevHash}`);
}

export class AppendOnlyAudit {
  private events: AuditEvent[] = [];
  private lastHash = GENESIS;

  /** Solo append; no existe update/delete. Devuelve el evento persistido. */
  append(entry: AuditEntry): AuditEvent {
    const seq = this.events.length;
    const event: AuditEvent = {
      seq,
      id: randomUUID(),
      at: entry.at ?? new Date().toISOString(),
      actor: entry.actor,
      action: entry.action,
      subject: entry.subject,
      prevHash: this.lastHash,
      hash: "",
    };
    event.hash = eventHash(event);
    this.lastHash = event.hash;
    this.events.push(event);
    return { ...event };
  }

  /** Lista de solo lectura (copia). */
  list(): AuditEvent[] {
    return this.events.map((e) => ({ ...e }));
  }

  /**
   * Verifica la integridad de toda la cadena desde el genesis.
   * Devuelve ok:false con la posicion exacta del primer eslabon roto.
   */
  verify(): { ok: boolean; brokenAt?: number; reason?: string } {
    let prevHash = GENESIS;
    for (let i = 0; i < this.events.length; i += 1) {
      const e = this.events[i];
      if (e.seq !== i) {
        return { ok: false, brokenAt: i, reason: "secuencia fuera de orden" };
      }
      if (e.prevHash !== prevHash) {
        return { ok: false, brokenAt: i, reason: "hash previo no coincide (evento alterado o eliminado)" };
      }
      const computed = eventHash(e);
      if (computed !== e.hash) {
        return { ok: false, brokenAt: i, reason: "hash del evento no coincide (evento alterado)" };
      }
      prevHash = e.hash;
    }
    return { ok: true };
  }
}
