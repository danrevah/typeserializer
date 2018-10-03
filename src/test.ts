import "reflect-metadata"
import * as TS from "./index"
@TS.Strategy(TS.ExclusionPolicy.ALL)
class User {
	// @TS.Name("as")
	protected uuid: number = 0

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
	username: "vicky"
}
let des = <User>TS.deserialize(JSON.stringify(response), User)

console.log("default", user)
console.log("serialize", TS.serialize(user))
console.log("response", response)
console.log("deserialize", des)
console.log("details", des.details)