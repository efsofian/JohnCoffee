import Head from "next/head";
import Image from "next/image";
import { fetchCoffeeStores } from "../lib/coffee_store";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner.component";
import Card from "../components/card.component";
import data from "../data/coffee-stores.json";

export default function Home({ coffeeStores }) {
	const handleOnBannerBtnClick = () => {
		console.log("hi banner button");
	};
	return (
		<div className={styles.container}>
			<Head>
				<title>John Coffe</title>
				<meta name="description" content="Coffee land" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Banner
					buttonText="View store nearby"
					handleOnClick={handleOnBannerBtnClick}
				/>
				<div className={styles.heroImage}>
					<Image
						src="/static/hero-image.png"
						alt="hero"
						width={700}
						height={300}
					/>
				</div>
				{coffeeStores.length > 0 && (
					<>
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
					</>
				)}
			</main>
		</div>
	);
}

export async function getStaticProps(context) {
	try {
		const coffeeStores = await fetchCoffeeStores();
		console.log("from index");
		console.log(coffeeStores);
		return {
			props: { coffeeStores },
		};
	} catch (e) {
		console.log(e);
	}
}
