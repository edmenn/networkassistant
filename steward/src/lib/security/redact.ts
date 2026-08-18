/**
 * Redaccion central (U3, ADR-0003).
 *
 * Permite registrar valores sensibles (secretos) y garantizar que no aparezcan
 * en ninguna superficie (API, logs, errores, auditoria, trazas, prompts).
 * Se aplica sobre strings y estructuras anidadas; los valores sensibles se
 * reemplazan por un marcador estable.
 *
 * Regla de seguridad: se redacta SIEMPRE (allowlist), nunca por omision.
 */

const MARKER = "[REDACTED]";

export class Redactor {
  private values: string[] = [];

  add(value: string): void {
    const v = typeof value === "string" ? value : "";
    if (v.length > 0 && !this.values.includes(v)) {
      this.values.push(v);
      // Ordenar de mas largo a mas corto para evitar que un prefijo corto
      // oculte la parte restante de un valor mas largo.
      this.values.sort((a, b) => b.length - a.length);
    }
  }

  addMany(values: string[]): void {
    for (const v of values) {
      this.add(v);
    }
  }

  get size(): number {
    return this.values.length;
  }

  redactString(input: string): string {
    if (!input) {
      return input;
    }
    let out = String(input);
    for (const value of this.values) {
      if (out.includes(value)) {
        out = out.split(value).join(MARKER);
      }
    }
    return out;
  }

  /** Redaccion profunda: recorre objetos, arrays y strings. No muta la entrada. */
  redact<T>(value: T): T {
    if (value === null || value === undefined) {
      return value;
    }
    if (typeof value === "string") {
      return this.redactString(value) as unknown as T;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.redact(item)) as unknown as T;
    }
    if (typeof value === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
        out[key] = this.redact(item);
      }
      return out as unknown as T;
    }
    return this.redactString(String(value)) as unknown as T;
  }
}

/** Redactor global por defecto para el proceso. */
export const redactor = new Redactor();

/** Atajo: redacta una estructura con el redactor global. */
export function redact<T>(value: T): T {
  return redactor.redact(value);
}
