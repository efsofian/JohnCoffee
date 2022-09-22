import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee_store";
import styles from "../../styles/coffee-store.module.css";
import data from "../../data/coffee-stores.json";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { StoreContext } from "../../context/store/store.context";
import { isEmpty } from "../../utils";

const CoffeeStore = (initialProps) => {
	const router = useRouter();
	const { id } = router.query;
	const [votingCount, setVotingCount] = useState(0);
	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);
	const {
		state: { coffeeStores },
	} = useContext(StoreContext);
	const { data, error } = useSWR(`/api/getcsbyid?id=${id}`, fetcher);

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});
				if (findCoffeeStoreById) {
					setCoffeeStore(findCoffeeStoreById);
					handleCreateCoffeeStore(findCoffeeStoreById);
				}
			}
		} else {
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}
	}, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);
	if (router.isFallback) {
		return <div>Loading</div>;
	}
	if (error)
		return <div>Something went wrong... retrieving coffee store page</div>;
	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
			const response = await fetch("/api/createcoffeestore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					imgUrl,
					neighbourhood: neighbourhood || "",
					address: address || "",
				}),
			});
			const dbCoffeeStore = await response.json();
		} catch (e) {
			console.error("error craeting coffee store ", e);
		}
	};

	const { address, neighbourhood, name, imgUrl } = coffeeStore;

	const handleUpVoteButton = async () => {
		try {
			const response = await fetch("/api/upvotecs", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});
			const dbCoffeeStore = await response.json();
			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				setVotingCount((oldVote) => oldVote + 1);
			}
		} catch (e) {
			console.error("error upvoting coffee store ", e);
		}
	};

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
					{neighbourhood && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/nearMe.svg"
								width="24"
								height="24"
								alt="near coffee locations"
							/>
							<p className={styles.text}>{neighbourhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width="24"
							height="24"
							alt="str"
						/>
						<p className={styles.text}>{votingCount}</p>
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
	const coffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id;
	});
	return {
		props: {
			coffeeStore: coffeeStoreById ? coffeeStoreById : {},
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
