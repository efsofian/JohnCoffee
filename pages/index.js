import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { fetchCoffeeStores } from "../lib/coffee_store";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner.component";
import Card from "../components/card.component";
import { ACTION_TYPES, StoreContext } from "../context/store/store.context";
import { useTrackLocation } from "../hooks/useTrackLocation";
import data from "../data/coffee-stores.json";
import { useEffect } from "react";

export default function Home({ coffeeStores }) {
	const [coffeeStoresError, setCoffeeStoresError] = useState(null);
	const { dispatch, state } = useContext(StoreContext);
	const { latLong } = state;

	const { handleTrackLocation, locationError, isFindingLocation } =
		useTrackLocation();
	const handleOnBannerBtnClick = () => {
		handleTrackLocation();
	};

	useEffect(() => {
		const fetchAsync = async () => {
			if (latLong) {
				try {
					const res = await fetch(
						`/api/getcsbylocation?latLong=${latLong}&${30}`
					);
					const fetchedCoffeeStores = await res.json();
					// setStateCoffees(fetchedCoffeeStores);
					dispatch({
						type: ACTION_TYPES.SET_COFFEE_STORES,
						payload: { coffeeStores: fetchedCoffeeStores },
					});
					setCoffeeStoresError("");
				} catch (e) {
					console.log(e);
					setCoffeeStoresError(e.message);
				}
			}
		};
		fetchAsync();
	}, [latLong]);

	return (
		<div className={styles.container}>
			<Head>
				<title>John Coffe</title>
				<meta name="description" content="Coffee land" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Banner
					buttonText={isFindingLocation ? "Locating..." : "View store nearby"}
					handleOnClick={handleOnBannerBtnClick}
				/>
				{locationError && <p>Something went wrong: {locationError}</p>}
				{coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
				<div className={styles.heroImage}>
					<Image
						src="/static/hero-image.png"
						alt="hero"
						width={700}
						height={300}
					/>
				</div>

				{state.coffeeStores.length > 0 && (
					<>
						<div className={styles.sectionWrapper}>
							<h2 className={styles.heading2}>Stores neare me</h2>

							<div className={styles.cardLayout}>
								{state.coffeeStores.map((elem) => {
									return (
										<Card
											key={elem.id}
											className={styles.card}
											name={elem.name}
											imgUrl={
												elem.imgUrl ||
												"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
											}
											href={`/coffee-store/${elem.id}`}
										/>
									);
								})}
							</div>
						</div>
					</>
				)}

				{coffeeStores.length > 0 && (
					<>
						<div className={styles.sectionWrapper}>
							<h2 className={styles.heading2}>Toronto Stores</h2>

							<div className={styles.cardLayout}>
								{coffeeStores.map((elem) => {
									return (
										<Card
											key={elem.id}
											className={styles.card}
											name={elem.name}
											imgUrl={
												elem.imgUrl ||
												"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
											}
											href={`/coffee-store/${elem.id}`}
										/>
									);
								})}
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
}

export async function getStaticProps(context) {
	try {
		const coffeeStores = await fetchCoffeeStores();
		return {
			props: { coffeeStores },
		};
	} catch (e) {
		console.log(e);
	}
}
