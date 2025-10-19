export const slideIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
export const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export const headerVariant = {
	hidden: { opacity: 0, y: 30 },
	show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export const cardVariant = {
	hidden: { opacity: 0, x: 50 },
	show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
	exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
};

export const hoverTap = {
	whileHover: { scale: 1.05 },
	whileTap: { scale: 0.95 },
};

export const spinnerVariant = {
	animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: 'linear' } },
};
