import styles from "./styles/ActivityCard.module.scss"

const ActivityCard = props =>{
    
    return(<div style={props.style} className={styles.outerContainer}>
        <div className={styles.categoryStripe}></div>
        <div className={styles.innerContainer}>
        <div className={styles.name}></div>
        <div className={styles.description}></div>
        <div className={styles.specsContainer}>
            <div className={styles.specsIconContainer}>
                <div className={`${styles.specsIcon} time-icon`}></div>
                <div className={styles.specsRating}></div>
            </div>
            <div className={styles.specsIconContainer}>
                <div className={`${styles.specsIcon} cost-icon`}></div>
                <div className={styles.specsRating}></div>
            </div>
            <div className={styles.specsIconContainer}>
                <div className={`${styles.specsIcon} duration-icon`}></div>
                <div className={styles.specsRating}></div>
            </div>
            <div className={styles.specsIconContainer}>
                <div className={`${styles.specsIcon} duration-icon`}></div>
                <div className={styles.specsRating}></div>
            </div>
        </div>
        </div>
    </div>)
}

export default ActivityCard