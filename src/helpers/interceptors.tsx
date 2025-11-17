import axios from "axios";
import { UserActionTypes } from "../_redux/reducers/types";
import { BASE_URL } from "../consts";
import { store } from "../store/configureStore";

export function setupInterceptors(dispatch: any) {
	axios.interceptors.response.use(null, async (error) => {
		const { response } = error;
		if (!response) {
			return;
		}

		if ([401, 403].includes(response.status)) {
			// Get Redux state
			const currentState = store.getState();
			// Access the required state properties
			const userId = currentState.authReducer.user?.user_id;

			// auto logout if 401 or 403 response returned from api
			await axios.post(`${BASE_URL}/logout`, { id: userId }).then(
				(res) => {
					dispatch({
						type: UserActionTypes.LOGOUT,
						isAuthenticated: false,
						user: {},
						token: "",
					});
				},
				(error) => {},
			);
		}
	});
}
