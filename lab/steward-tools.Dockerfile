# Capa de laboratorio sobre la imagen baseline de Steward (commit ea6a476).
# El broker SSH del baseline usa `sshpass` + `ssh` en runtime; la imagen
# original no los instala. Se agregan aqui SOLO para el laboratorio sintetico
# (Sprint 0). No es la imagen objetivo de produccion.
FROM steward-sprint0-web:baseline

USER root
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    openssh-client sshpass \
  && rm -rf /var/lib/apt/lists/*
USER nextjs