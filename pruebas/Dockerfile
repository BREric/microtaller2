FROM jenkins/jenkins:lts

USER root

# Instalar Docker y dependencias necesarias
RUN apt-get update && apt-get install -y \
    sudo \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
    && apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io \
    && apt-get clean

# Instalar Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Instalar Node.js (Actualizado a la versión 18)
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Agregar el usuario Jenkins al grupo Docker
RUN usermod -aG docker jenkins

USER jenkins

# Configuración del directorio de trabajo
WORKDIR /var/jenkins_home/workspace

# Exponer el puerto para Jenkins
EXPOSE 8080

# Volumen para persistencia
VOLUME /var/jenkins_home
