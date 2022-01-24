import "./App.css";
import { useEffect, useRef, useState } from "react";
import api from "./api/api";
function App() {
	const emailRef = useRef();
	const passRef = useRef();
	const nameRef = useRef();
	const [currentUser, setUser] = useState({});
	const signup = async () => {
		try {
			console.log("signing up");
			const user = await api.post("/users/signup", {
				name: nameRef.current.value,
				email: emailRef.current.value,
				password: passRef.current.value,
			});
			window.localStorage.setItem("token", user.data.genToken);
			setUser(user.data.user);
		} catch (e) {
			console.error(e.response);
		}
	};
	const login = async () => {
		const token = window.localStorage.getItem("token");
		try {
			let user;
			if (!token) {
				console.log("logging in");
				user = await api.post("/users/login", {
					email: emailRef.current.value.toLowerCase(),
					password: passRef.current.value,
				});
				console.log(user);
				window.localStorage.setItem("token", user.data.genToken);
			} else {
				console.log("logging in with token");
				user = await api.post("/users/login", {
					token,
				});
				console.log(user);
			}
			setUser(user.data.user);
		} catch (e) {
			console.error(e.response);
		}
	};
	const logout = async () => {
		const token = window.localStorage.getItem("token");
		try {
			const res = await api.post(
				"/users/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			window.localStorage.removeItem("token");
			setUser({});
		} catch (e) {
			console.error(e);
		}
	};
	useEffect(() => {
		if (window.localStorage.getItem("token")) login();
	}, []);
	if (currentUser.hasOwnProperty("name")) {
		return (
			<div className="form-container">
				<p>Welcome {currentUser.name} to our website</p>
				<button onClick={logout}>Logout</button>
			</div>
		);
	}
	return (
		<div className="form-container">
			<div className="login">
				<label>Name</label>
				<input type="text" className="name" ref={nameRef} />
				<label>Email</label>
				<input type="email" className="email" ref={emailRef} />
				<label>Password</label>
				<input type="password" className="password" ref={passRef} />
				<button type="submit" onClick={login}>
					Login
				</button>
				<button type="submit" onClick={signup}>
					Signup
				</button>
			</div>
		</div>
	);
}
export default App;
