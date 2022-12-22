import React, { useEffect, useState } from "react";

const UnmountTest = () => {
    useEffect(() => {
        console.log("Mount")

        return () => {
            console.log("Unmount!")
        }
    }, [])
    return <div>Unmount Testing Component</div>
}

const Lifecycle = () => {
    const [isVisible, setIsVisible] = useState(false)
    const toggle = () => setIsVisible(!isVisible)

    return (
        <div style={{ padding: 20 }}>
            <button onClick={toggle}>ON/OFF</button>
            {isVisible && <UnmountTest />}
        </div>
    )

    // const [count, setCount] = useState(0)
    // const [text, setText] = useState("")
    // useEffect(() => {
    //     console.log("Mount")
    // }, [])
    // useEffect(() => {
    //     console.log("Update")
    // })
    // return <div style={{ padding: 20 }}>
    //     <div>
    //         {count}
    //         <button onClick={() => setCount(count + 1)}>+</button>
    //         <div>
    //             <input value={text} onChange={(e) => setText(e.target.value)} />
    //         </div>
    //     </div>
    // </div>
}
export default Lifecycle