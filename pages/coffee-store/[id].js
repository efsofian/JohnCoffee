import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee_store";
import styles from "../../styles/coffee-store.module.css";
import data from "../../data/coffee-stores.json";

const CoffeeStore = ({ coffeeStore }) => {
	console.log(coffeeStore);
	const router = useRouter();
	const { id } = router.query;

	if (router.isFallback) {
		return <div>Loading</div>;
	}
	const { address, neighborhood, name, imgUrl } = coffeeStore;
	const handleUpVoteButton = () => {};

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/">← Back to home</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>

					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
						}
						height={360}
						width={600}
						className={styles.storeImg}
						alt={name}
					/>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/places.svg"
								width="24"
								height="24"
								alt="coffee location"
							/>
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/nearMe.svg"
								width="24"
								height="24"
								alt="near coffee locations"
							/>
							<p className={styles.text}>{neighborhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width="24"
							height="24"
							alt="str"
						/>
						<p className={styles.text}>1</p>
					</div>
					<button className={styles.upvoteButton} onClick={handleUpVoteButton}>
						Up Vote !
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;

export async function getStaticProps({ params }) {
	const coffeeStores = await fetchCoffeeStores();
	return {
		props: {
			coffeeStore: coffeeStores.find((coffeeStore) => {
				return coffeeStore.id.toString() === params.id;
			}),
		},
	};
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});
	return {
		paths,
		fallback: true,
	};
}
