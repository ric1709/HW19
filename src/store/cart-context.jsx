import React, { useReducer } from 'react'
import { ADD, REMOVE, INCREASE } from '../helpers/constants'

const CardContext = React.createContext()

const intitState = {
	items: [],
	totalPrice: 0,
}

const cartReducer = (state, action) => {
	switch (action.type) {
		case ADD:
			let bool = state.items.findIndex((el) => el.id === action.item.id)
			if (bool === -1) {
				let newItem = { ...action.item, amount: 1 }
				const newItems = state.items.concat(newItem)
				const newAmount = state.totalPrice + action.item.price
				return {
					...state,
					items: newItems,
					totalPrice: newAmount,
				}
			} else {
				const newPrice = state.totalPrice + action.item.price
				let newState = state.items.map((el, index) => {
					return index === bool
						? { ...el, amount: el.amount + 1 }
						: el
				})
				return {
					...state,
					items: newState,
					totalPrice: newPrice,
				}
			}
		case INCREASE:
			let currentIndex = state.items.findIndex(
				(el) => el.id === action.data.id,
			)
			if (currentIndex === -1) {
				let newItem = { ...action.data, amount: action.amount }
				const newItems = state.items.concat(newItem)
				const newPrice = action.data.price * action.amount
				const newAmount = state.totalPrice + newPrice
				return {
					...state,
					items: newItems,
					totalPrice: newAmount,
				}
			} else {
				const newPrice = action.data.price * action.amount
				const newAmount = state.totalPrice + newPrice
				let newState = state.items.map((el, index) => {
					return index === currentIndex
						? { ...el, amount: el.amount + 1 }
						: el
				})
				return {
					...state,
					items: newState,
					totalPrice: newAmount,
				}
			}

		case REMOVE:
			let currentElem = state.items.find((el) => el.id === action.id)
			if (currentElem.amount === 1) {
				let newItems = state.items.filter((el) => el.id !== action.id)
				return {
					...state,
					items: newItems,
					totalPrice: state.totalPrice - currentElem.price,
				}
			} else {
				let newData = state.items.map((el) => {
					return el.id === action.id
						? { ...el, amount: --el.amount }
						: el
				})
				return {
					...state,
					items: newData,
					totalPrice: state.totalPrice - currentElem.price,
				}
			}

		default:
			return state
	}
}

export const CardContextProvider = (props) => {
	const [state, dispatch] = useReducer(cartReducer, intitState)
	const onAddHandler = (item, inputValue) => {
		dispatch({ type: ADD, item, inputValue })
	}
	const onRemoveHandler = (id) => {
		dispatch({ type: REMOVE, id })
	}
	const onIncreaseHandler = (data, newAmount) => {
		dispatch({ type: INCREASE, data, amount: newAmount })
	}
	return (
		<CardContext.Provider
			value={{
				items: state.items,
				totalPrice: state.totalPrice,
				onAdd: onAddHandler,
				onRemove: onRemoveHandler,
				onIncrease: onIncreaseHandler,
			}}
		>
			{props.children}
		</CardContext.Provider>
	)
}

export default CardContext
