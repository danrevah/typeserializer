import "reflect-metadata"
import * as TS from "./index"
@TS.Strategy(TS.ExclusionPolicy.ALL)
class User {
	@TS.Expose()
	@TS.Name("id")
	protected uuid: number
	
	@TS.Expose()
	@TS.Name("username")
	public name: String
	constructor() {}

	public get details(): Object {
		return this
	}
}

let user = new User()
let response = {
	id: 3,
	username: "vicky"
}
let des = <User>TS.deserialize(JSON.stringify(response), User)

console.log("default", user)
console.log("serialize", TS.serialize(user))
console.log("response", response)
console.log("deserialize", des)
console.log("details", des.details)