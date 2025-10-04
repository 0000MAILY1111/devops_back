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
}
