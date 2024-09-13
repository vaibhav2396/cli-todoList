#!/usr/bin/env node


import {program} from "commander"
import fs from "fs"

const dataFile = "Todos.json" // Name of the JSON file where data is stored

program.version("1.0.0").description("A simple CLI TODO list")


//Function to update or delete any todo task
function updateTask(id, objective){
    // function expects an object named as objective,
    // if the object contains description, it means user wants to change the Task's description
    // if it contains status, it means user wants to change the status of the task
    // if it is empty, it means user wants to delete the task

    // this checks whether the Data file exists
    if(! fs.existsSync(dataFile)){
        console.log("Invalid task id")
        return
    }

    //In case the file exists 
    fs.readFile(dataFile, "utf-8", (err, res)=>{
        if(err){
            console.log("Error while reading the tasks file")
            return
        }
        //Important to parse the file's data
        const data = JSON.parse(res)
        const index = data.findIndex(todo => todo.id == id)
        if(index == -1){
            console.log("Invalid task id")
            return
        }
        if(objective.description){
            // This updates the task's description
            data[index].description = objective.description
            data[index].updatedAt = Date.now()
        } else if(objective.status){
            //this changes the task's status
            data[index].status = objective.status
            data[index].updatedAt = Date.now()
        } else{
            //this deletes the task
            data.splice(index,1)
        }
        
        fs.writeFile(dataFile, JSON.stringify(data), (err)=>{
            if(err){
                console.log("Error while updating the task")
                return
            }
            console.log("Task updated")
        })
        
    })

}

function list(status=""){
    // this function expects a status
    // if any status is passed, this logs all the tasks which matches the status
    // if status is empty, function logs all the tasks

    if(!fs.existsSync(dataFile)){
        console.log("No tasks")
        return
    }
    fs.readFile(dataFile, 'utf-8', (err, res)=>{
        if (err){
            console.log("Error while reading list")
            return
        }
        const data = JSON.parse(res)
        if(data.length == 0){
            console.log("No tasks")
            return
        }
        if(status){
            data.map(todo=>{
                if(todo.status == status){
                    console.log(`${todo.id} - ${todo.description}`)
                }
            })
        }else{
            data.map(todo=>{
                console.log(`${todo.id} - ${todo.description}`)
            })
        }
        
    })
}

function createTask(description){
    // if the file exists, read the data and add a new task
    if(fs.existsSync("Todos.json")){
        fs.readFile("Todos.json", "utf-8", (err, res)=>{
            if(err){
                console.log("Error while adding the task")
                console.log(err)
            }
            else{
                let data = JSON.parse(res)
                const setId = data.length ? data[data.length - 1].id + 1 : 1 
                data.push({
                    id: setId,
                    description: description,
                    status: "todo",
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })
                fs.writeFile("Todos.json", JSON.stringify(data), (err)=>{
                    if(err){
                        console.log("Error while adding the task")
                    }else{
                        console.log("Task added successfully")
                    }
                })
            }
        })
        
    }
    else{
        // file doesn't exist, create a new file
        const data = [{
            id: 1,
            description: description,
            status: "todo",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }]
        fs.writeFile("Todos.json", JSON.stringify(data),err=>{
            if(err){
                console.log("Error while creating task")
            }
            
        })
    }
}

program
    .command('list [status]')
    .description("Changing the status of the task to done")
    .action(status => list(status))

program
    .command('mark-done <id>')
    .description("Changing the status of the task to done")
    .action(id => updateTask(id, {status: "done"}))

program
    .command('mark-in-progress <id>')
    .description("Changing the status of the task to in-progress")
    .action(id => updateTask(id, {status: "in-progress"}))

program
    .command('delete <id>')
    .description('Deleting a Task')
    .action(id => updateTask(id, {delete: true}))

program
    .command('update <id> <task>')
    .description("Updating a Task")
    .action((id,task) => updateTask(id, {description: task}))

program
  .command('add <name>')
  .description('Greet a person')
  .action((name) => createTask(name));

// Parse command-line arguments
program.parse(process.argv);