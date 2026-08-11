# ADR-0003 — Backend de vault (OpenBao) para desarrollo y producción

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

El vault actual de Steward cifra con AES-256-GCM y una clave almacenada en `vault.key`, protegida por OS-keystore con un **fallback "machine-derived key" en Linux**. El blueprint prohíbe derivar la clave maestra de datos previsibles del host y exige `SecretBackend` con `put`, `lease`, `revoke`, `rotate`, `backup` y `restore`.

## Decisión

Adoptar **OpenBao** (código abierto de HashiCorp Vault) como backend, accesible **solo** mediante la interfaz `SecretBackend`.

- **Desarrollo:** OpenBao en contenedor de desarrollo con auto-unseal de desarrollo y datos ficticios.
- **Producción:** OpenBao con separación de clave de unseal y datos, autenticación de workload (no secreto global), leases cortos y revocables.

## Diseño de la interfaz

```ts
interface SecretBackend {
  put(ref, secret, opts): Promise<void>;
  lease(ref, identity, ttl): Promise<Lease>;   // entrega temporal
  revoke(leaseId): Promise<void>;
  rotate(ref): Promise<void>;
  backup(scope): Promise<Backup>;              // cifrado
  restore(backup): Promise<void>;
}
```

## Criterios a probar en Sprint 1

- Separación clave/datos; autenticación de workload; leases revocables; rotación sin exponer valores; backup/restore en host limpio; redacción central en UI/API/logs/prompts; sin secretos huérfanos tras fallo transaccional.

## Consecuencias

- El control plane ya no guarda ni descifra secretos por sí mismo; entrega referencias opacas y leases solo al worker autorizado.
- Se elimina `vault.key` y el fallback de clave derivada del host.

## Estado de cierre

Decisión fijada; la implementación se ejecuta en Sprint 1.
