import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../context/store/store.context";

export const useTrackLocation = () => {
	const [locationError, setLocationError] = useState("");
	const [latLong, setLatLong] = useState("");
	const [isFindingLocation, setIsFindingLocation] = useState(false);

	const { dispatch } = useContext(StoreContext);

	const success = (position) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		// setLatLong(`${latitude},${longitude}`);
		dispatch({
			type: ACTION_TYPES.SET_LAT_LONG,
			payload: { latLong: `${latitude},${longitude}` },
		});
		setLocationError("");
		setIsFindingLocation(false);
	};

	const error = () => {
		setLocationError("Unable to retrieve location");
		setIsFindingLocation(false);
	};

	const handleTrackLocation = () => {
		setIsFindingLocation(true);
		if (!navigator.geolocation) {
			setLocationError("Geo Location not supported by your browser");
			setIsFindingLocation(false);
		} else {
			navigator.geolocation.getCurrentPosition(success, error);
		}
	};
	return {
		// latLong,
		handleTrackLocation,
		locationError,
		isFindingLocation,
	};
};
