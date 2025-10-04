import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import { IProject } from "../models/Project";

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id); // Agregar la tarea al proyecto

            await Promise.allSettled([task.save(), req.project.save()]);
            res.send("Tarea creada correctamente");
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate("project")
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    /// para las TAREAS 

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params            
            const task = await Task.findById(taskId)
            if (!task) {
                const error = new Error("Tarea no encontrada");
                return res.status(404).json({ error: error.message });
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send("tarea actualizada correctamente")
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString () !== req.task.id.toString()) ///para eliminar la tarea del proyecto
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send("tarea eliminada correctamente")
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
        const { status } = req.body
        req.task.status = status
        await req.task.save()
        res.send("Estado de la tarea actualizado correctamente")
        }catch(error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
   }
}

export default TaskController;