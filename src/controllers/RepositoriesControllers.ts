import type {Request, Response} from "express";
import Project from "../models/Project";
import Repository from "../models/Repository";

export class RepositoryController {

    static createRepository = async (req: Request, res: Response) => {
        try {
            const repository = new Repository(req.body);
            repository.project = req.project.id;

            await Promise.allSettled([repository.save(), req.project.save()]);
            res.send("Repositorio agregado correctamente")
        } catch (error) {
            res.status(500).json({error: "Error en el servidor"});
        }
    }

    static getProjectRepositories = async (req: Request, res: Response) => {
        try {
            const repo = await Repository.find({project: req.project.id}).populate("project")
            res.json(repo)
        } catch (error) {
            res.status(500).json({error: "Error en el servidor"})
        }
    }

    static getRepositoryById = async (req: Request, res: Response) => {
        try {
            const { repoId } = req.params
            const repo = await Repository.findById(repoId)
            if (!repo){
                const error = new Error("Tarea no encontrada");
                return res.status(404).json({error: error.message});
            }
            res.json(repo)
        } catch (error) {
            res.status(500).json({error: "Error del servidor"})
        }
    }
}
