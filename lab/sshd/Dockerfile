FROM debian:bookworm-slim

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    openssh-server iproute2 procps \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /run/sshd /etc/steward-lab \
  && useradd -m -s /bin/bash fwlab \
  && echo 'fwlab:FwLab-Ro-2026!lab' | chpasswd \
  && sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config \
  && printf '\nUsePAM no\nLogLevel VERBOSE\n' >> /etc/ssh/sshd_config

COPY fw-identity /etc/steward-lab/fw-identity

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D", "-e"]