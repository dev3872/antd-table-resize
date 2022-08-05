import React, { useCallback, useEffect, useState } from "react";
import { Resizable } from "react-resizable";
import { Table } from "antd";
import "./App.scss";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import Draggable from "react-draggable";
const dataSourceMock = [
	{
		key: "1",
		name: "HJHJH",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "2",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
	{
		key: "3",
		name: "HJHJH",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "4",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
	{
		key: "5",
		name: "HJHJH",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "6",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
	{
		key: "7",
		name: "HJHJH",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "8",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
	{
		key: "9",
		name: "HJHJH",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "10",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
];
const ResizeableTitle = (props) => {
	const { onResize, width, ...restProps } = props;

	if (!width) {
		return <th className="react-resizable" {...restProps} />;
	}

	return (
		<Resizable
			width={width}
			height={0}
			onResize={onResize}
			draggableOpts={{ enableUserSelectHack: true }}
		>
			<th {...restProps} />
		</Resizable>
	);
};
const DraggableCell = (props) => {
	const { className, ...restProps } = props;
	//console.log(props)
	return (
		<td className={`${className} react-draggable`} {...restProps}>
			<span className="react-draggable-handle" />
		</td>
	);
};
const columnsMock = [
	{
		title: "Name",
		dataIndex: "name",
		key: 1,
		width: 100,
		//width: 900,
		//fixed: "left",
	},
	{
		title: "Age",
		dataIndex: "age",
		key: 2,
		width: 100,
	},
	{
		title: "Address",
		dataIndex: "address",
		key: 3,
		width: 100,
	},
	{
		title: "Age",
		dataIndex: "age",
		key: 4,
		width: 100,
	},
	{
		title: "Address",
		dataIndex: "address",
		key: 5,
		width: 200,
	},
];

const AntdTable = () => {
	const [columns, setColumns] = useState([...columnsMock]);
	const [dataSource, setDataSource] = useState([...dataSourceMock]);
	const [fixed, setFixed] = useState(3); //columns fixed
	const [height, setHeight] = useState(0); //yposition
	const [fixedRow, setFixedRow] = useState(0);
	const [left, setLeft] = useState(0); //xposition of drag bar
	const [xPos, setxPos] = useState(0); //xpostion of cursor
	const [controlled, setControlled] = useState({ x: 0, y: 0 });
	const [newPosX, setNewPosX] = useState(0)
	const nodeRef = React.useRef(null);

	useEffect(() => {
		let totalWidth = 0;
		columns.forEach((value, index) => {
			if (index >= fixed) return;
			else totalWidth += value.width;
		});
		setLeft(totalWidth);
		setNewPosX(totalWidth)
		setControlled({ ...controlled, x: totalWidth - 3 });
	}, [fixed, columns]);

	useEffect(() => {
		const handleResize =
			(index) =>
			(e, { size }) => {
				const nextColumns = [...columns];
				nextColumns[index] = {
					...nextColumns[index],
					width: size.width,
				};
				setColumns([...nextColumns]);
			};
		const newCol = columns.map((col, index) => ({
			...col,
			onHeaderCell: (column) => ({
				width: column.width,
				onResize: handleResize(index),
			}),
		}));

		setColumns([...newCol]);
	}, [columns]);
	useEffect(() => {
		console.log(left);
	}, [left]);
	// useEffect(() => {
	// 	const newCol = columns.map((col, index) => {
	// 		//console.log(col,index)
	// 		return {
	// 			...col,
	// 			className:
	// 				fixed === index ? `ant-table-cell border-left` : "ant-table-cell",
	// 		};
	// 	});

	// 	setColumns([...newCol]);
	// }, [fixedRow, fixed, xPos]);

	const components = {
		header: {
			cell: ResizeableTitle,
		},
		// body: {
		// 	cell: DraggableCell,
		// 	//row:(value,record)=>{}
		// },
	};

	return (
		<div
			className="tableclass"
			onMouseMove={(event) => {
				setHeight(event.clientY);
				setxPos(event.clientX);
				//setControlled({ x: controlled.x, y: event.clientY });
			}}
		>
			<Draggable
				bounds={"parent"}
				//bounds={{left:0,right:600,top:30}}
				nodeRef={nodeRef}
				axis={"x"}
				position={{x:newPosX,y:400}}
				onDrag={(e, position) => {
					// setHeight(y+height);
					// setxPos(e.clientX);
					//setControlled({ x:e.clientX, y });
					setNewPosX(e.clientX)
				}}
				onStop={(e, pos) => {
					//a = e.pageX is this position right?
					var a = e.clientX;
					console.log(e);
					var temp = 0;
					columns.forEach((col, index) => {
						temp += col.width;
						if (temp - a < 10 && temp - a > -10) {
							console.log("working");
							setLeft(left);
							setFixed(index + 1);
							setControlled({ x: pos.x, y: pos.y });
							console.log("this is ", index + 1);
						}
						// console.log(index)
					});
				}}
			>
				<span
					ref={nodeRef}
					className={"drag-height"}
					style={{
						position: "absolute",
						top: 40,
						left: left,
						zIndex: "10",
						width: "3px",
						borderRadius: "3px",
						backgroundColor: "green",
					}}
				>
					<span
						style={{
							display: xPos < left - 4 || xPos > left + 4 ? "none" : "",
							position: "absolute",
							width: "10px",
							height: "30px",
							borderRadius: "3px",
							backgroundColor: "green",
							top: height-57,
							left: "-3px",
							zIndex: "12",
						}}
					></span>
				</span>
			</Draggable>

			<Table
				style={{ width: "fit-content" }}
				size="small"
				//className="tableclass"
				bordered
				pagination={false}
				onRow={(record, rowIndex) => {
					return {
						onMouseEnter: (event) => {
							setFixedRow(rowIndex + 1);
						},
					};
				}}
				onHeaderRow={(record, rowIndex) => {
					return {
						onMouseEnter: (event) => {
							setFixedRow(0);
						},
					};
				}}
				components={components}
				dataSource={dataSource}
				columns={columns}
				scroll={{ x: "max-content" }}
			></Table>
		</div>
	);
};

export default AntdTable;
