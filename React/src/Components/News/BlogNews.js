import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {APIS as apis} from "../apis"

import {NewsCard} from './index';

 const NewsItems = (props) => {
     const [data, setData] = useState([])
     
     useEffect(() => {
      fetchData()
     }, [props.item])

     //fetchdata on the basis of selected category or tag
     const fetchData = () => {
       if(props.item && props.item['category'])
       {
        axios.get(`${apis._getPostByCategory}?categoryName=${props.item['category']}`).then(({data})=>{
          setData(data)
        })
       }
       else
       {
        axios.get(`${apis._getPostByTag}?tagName=${props.item['tag']}`).then(({data})=>{
          setData(data)
         })
       }
       
     }

  return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
          {
             data && data.posts &&  data.posts.length &&  data.posts.map((post,index)=>{
                return <NewsCard key={index} post={post} />
             })
          }
      </div>
  );
}

export default NewsItems;