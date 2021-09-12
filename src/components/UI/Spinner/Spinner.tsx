import style from "./Spinner.module.css"
const Spinner = () => (
    <div className={`${style["sk-folding-cube" ]}`}>
        <div className={`${style["sk-cube1"]} ${style["sk-cube"]}`}></div>
        <div className={`${style["sk-cube2"]} ${style["sk-cube"]}`}></div>
        <div className={`${style["sk-cube4"]} ${style["sk-cube"]}`}></div>
        <div className={`${style["sk-cube3"]} ${style["sk-cube"]}`}></div>
    </div>
)

export default Spinner;