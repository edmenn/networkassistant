/**
 * RBAC por recurso (U4, ADR-0002). Evalua permisos sobre usuario/sitio/equipo/
 * metodo/secreto y clase de accion. Reglas:
 *  - Default deny: sin regla que permita, se deniega.
 *  - `deny` prevalece sobre `allow`.
 *  - Coincidencia por wildcard ("*") en cualquier dimension.
 *
 * Autocontenido y determinista; la autorizacion ocurre ANTES de cualquier
 * uso del modelo o herramienta (nunca se decide con IA).
 */

export type ActionClass =
  | "observe"
  | "probe"
  | "low_risk_change"
  | "high_risk_change"
  | "destructive";

export type Effect = "allow" | "deny";

export interface Grant {
  principal: string;
  site?: string;
  device?: string;
  resource?: string; // metodo o ref de secreto
  actionClass?: ActionClass | "*";
  effect: Effect;
}

export interface AccessRequest {
  principal: string;
  site?: string;
  device?: string;
  resource?: string;
  actionClass: ActionClass;
}

export class PolicyEngine {
  private grants: Grant[] = [];

  addGrant(grant: Grant): void {
    this.grants.push(grant);
  }

  addGrants(grants: Grant[]): void {
    for (const g of grants) {
      this.addGrant(g);
    }
  }

  /** Coincide si el valor pedido iguala el grant o el grant es wildcard. */
  private matches(grantValue: string | undefined, requested: string | undefined): boolean {
    if (grantValue === undefined || grantValue === "*") {
      return true;
    }
    if (requested === undefined) {
      return false;
    }
    return grantValue === requested;
  }

  private matchesGrant(grant: Grant, req: AccessRequest): boolean {
    return (
      (grant.principal === "*" || grant.principal === req.principal) &&
      this.matches(grant.site, req.site) &&
      this.matches(grant.device, req.device) &&
      this.matches(grant.resource, req.resource) &&
      this.matches(grant.actionClass, req.actionClass)
    );
  }

  /** Decide: default deny; cualquier deny que coincida prevalece. */
  decide(req: AccessRequest): Effect {
    let allowed = false;
    for (const grant of this.grants) {
      if (!this.matchesGrant(grant, req)) {
        continue;
      }
      if (grant.effect === "deny") {
        return "deny";
      }
      allowed = true;
    }
    return allowed ? "allow" : "deny";
  }

  isAllowed(req: AccessRequest): boolean {
    return this.decide(req) === "allow";
  }
}
