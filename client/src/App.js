import "./App.css";
function App() {
	return (
		<div className="form-container">
			<div className="login">
				<label>Name</label>
				<input type="text" className="name" />
				<label>Email</label>
				<input type="email" className="email" />
				<label>Password</label>
				<input type="password" className="password" />
				<button type="submit">Login</button>
			</div>
			<div className="signup">
				<label>Name</label>
				<input type="text" className="name" />
				<label>Email</label>
				<input type="email" className="email" />
				<label>Password</label>
				<input type="password" className="password" />
				<button type="submit">Signup</button>
			</div>
		</div>
	);
}
export default App;
