import mongoose from "mongoose";

export default () => {
	const connect = () => {
		mongoose
			.connect("mongodb://127.0.0.1:27017/React-chat-backend")
			.then(() => {
				console.log("Successfully connected to database");
			})
			.catch((error) => {
				console.log("Failed connecting to database", error);
				return process.exit(1);
			});
	};
	connect();
	mongoose.connection.on("disconnected", connect);
};
