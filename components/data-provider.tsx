import React from 'react'

interface DataProviderProps {
    children?: React.ReactChildren;
}

function DataProvider(props: DataProviderProps) {
  return (
    props.children
  )
}

export default DataProvider;