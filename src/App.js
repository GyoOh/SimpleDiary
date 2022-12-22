import React, { useRef, useCallback, useState, useEffect, useMemo, useReducer } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import Lifecycle from './Lifecycle';
import OptimizeTest from './OptimizeTest';

// const dummyList = [
//   {
//     id: 1,
//     author: "Gyo",
//     content: "hi1",
//     emotion: 5,
//     created_date: new Date().getTime()
//   },
//   {
//     id: 2,
//     author: "FSWD",
//     content: "hi2",
//     emotion: 3,
//     created_date: new Date().getTime()
//   },
//   {
//     id: 3,
//     author: "BCIT",
//     content: "hi3",
//     emotion: 1,
//     created_date: new Date().getTime()
//   },
// ]
//우리는 Reudcer라는 함수를 직접 만들어서 사용해야한다.
const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return action.data
    }
    case 'CREATE': {
      const created_date = new Date().getTime()
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state]
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId)
    }
    case 'EDIT': {
      return state.map((it) => it.id === action.targetId ? { ...it, content: action.newContent } : it
      )
    }
    default:
      return state
  }
}

export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext()

function App() {
  // const [data, setData] = useState([])
  const [data, dispatch] = useReducer(reducer, [])
  const dataId = useRef(0);
  const getData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments").then((res) => res.json())
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      }
    })
    dispatch({ type: "INIT", data: initData })
  }

  useEffect(() => {
    getData()
  }, [])
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({ type: 'CREATE', data: { author, content, emotion, id: dataId.current } })
    const created_date = new Date().getTime()
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current
    }
    dataId.current += 1;
  }, [])
  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId)
    dispatch({ type: "REMOVE", targetId })
  }
  const onEdit = (targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent })
  }
  //usememo로 묶어서 재 실행이 안되게 막아놔야한다.
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit }
  }, [])

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length
    const badCount = data.length - goodCount
    const goodRatio = (goodCount / data.length) * 100
    return { goodCount, badCount, goodRatio };
  }, [data.length]
  )

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis
  //일단 한번 useMemo를 통해서 값을 받아오면 이건 더 이상은 함수가 아니게 된다.
  // 이건 그냥 값이 된다.
  //
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext value={memoizedDispatches}>
        <div className="App">
          <OptimizeTest />
          <Lifecycle />
          <DiaryEditor onCreate={onCreate} />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList onEdit={onEdit} onRemove={onRemove} />
        </div>
      </DiaryDispatchContext>
    </DiaryStateContext.Provider>
  );
}

export default App;
