import { Request, Response } from "express";
import simpleGit from "simple-git";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
//import getPort from "get-port";



//const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const docker = new Docker({ 
  socketPath: '/home/carlos/.docker/desktop/docker.sock' 
});
const projectsDir = path.join(__dirname, "../../projects");
if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir);

export class DeployController {
  static deployProject = async (req: Request, res: Response) => {
    const { name, repoUrl, language, framework, database, variables_env } = req.body;
    const projectId = `proj_${Date.now()}`;
    const projectPath = path.join(projectsDir, projectId);

    console.log("Desplegando proyecto")

    try {
      // 1. Clonar repo si viene URL
      if (repoUrl) {
        await simpleGit().clone(repoUrl, projectPath);
      } else {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      // 2. Generar Dockerfile si no existe
      const dockerfilePath = path.join(projectPath, "Dockerfile");
      if (!fs.existsSync(dockerfilePath)) {
        let dockerfile = "";

        if (language === "python") {
          if (framework === "fastapi") {
            dockerfile = `
            FROM python:3.10
            WORKDIR /app
            COPY requirements.txt .
            RUN pip install -r requirements.txt
            COPY . .
            EXPOSE 8000
            CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
            `;
          } else if (framework === "django") {
            dockerfile = `
            FROM python:3.10
            WORKDIR /app
            COPY requirements.txt .
            RUN pip install -r requirements.txt
            COPY . .
            EXPOSE 8000
            CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
            `;
          } else if (framework === "flask") {
            dockerfile = `
            FROM python:3.10
            WORKDIR /app
            COPY requirements.txt .
            RUN pip install -r requirements.txt
            COPY . .
            EXPOSE 5000
            CMD ["python", "app.py"]
            `;
          }
        } else if (language === "node" && framework === "express") {
          dockerfile = `
          FROM node:18
          WORKDIR /app
          COPY package*.json ./
          RUN npm install
          COPY . .
          EXPOSE 3000
          CMD ["npm", "start"]
          `;
        }

        fs.writeFileSync(dockerfilePath, dockerfile.trim());
      }

      // 3. Construir imagen
      const imageTag = `${projectId}:latest`;
      const buildStream = await docker.buildImage(
        { context: projectPath, src: fs.readdirSync(projectPath) },
        { t: imageTag }
      );

      await new Promise((resolve, reject) => {
        docker.modem.followProgress(buildStream, (err, res) =>
          err ? reject(err) : resolve(res)
        );
      });

      // 4. Asignar puerto según framework
      let internalPort = 3000;
      if (framework === "fastapi" || framework === "django") internalPort = 8000;
      if (framework === "flask") internalPort = 5000;

      const { default: getPort } = await import('get-port');
        const hostPort = await getPort();

      const container = await docker.createContainer({
        Image: imageTag,
        name: projectId,
        ExposedPorts: { [`${internalPort}/tcp`]: {} },
        HostConfig: {
          PortBindings: { [`${internalPort}/tcp`]: [{ HostPort: hostPort.toString() }] }
        },
        Env: (variables_env || []).map((v: any) => `${v.key}=${v.value}`)
      });

      await container.start();

      // 5. Responder con URL
      res.json({
        message: "Proyecto desplegado correctamente",
        projectId,
        language,
        framework,
        database: database || null,
        env: variables_env || [],
        url: `http://localhost:${hostPort}`
      });

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
}

//export default DeployController;
