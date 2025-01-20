import { CreateTaskInput } from "./db"

export function DBErrorMessage(e:Error):{message:string, code:number} {
	switch(e.toString()){
		case "TASKS NOT FOUND":
			return {message:"Oops, the task you are looking for is missing", code:404}
		case "DB Error":
			return {message:"Oh no! We are currently having issues try again later", code:500}
		default:
			return {message:"Unknown Error has occured", code:500}
	}
}

export function validateNewTask(data:unknown):CreateTaskInput {
	if(typeof data !== 'object' || data == null) {
		throw new Error("No Data was given for the new task")
	}
	if(!("title" in data) || typeof data?.title !== "string"){
		throw new Error("Tasks require a title")
	}
	if(!("color" in data) || typeof data?.color !== "string"){
		throw new Error("Tasks require a color")
	}

	return data as CreateTaskInput
}
