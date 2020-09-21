import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

export default function CardElement(props) {

const { classes , data } = props;

    return (
        <Card className={classes.root}>
        <CardHeader
          title={data.title}
          subheader={data.modifiedTime}
          />
          <CardMedia
              className={classes.media}
              image={data.featured_image && data.featured_image}
              title={data.title}
          />
          <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
          { ReactHtmlParser(data.excerpt)}
          </Typography>
          </CardContent>
          <CardActions>
              <Link href={data.URL} target="_blank">
                  Read More...
              </Link>
          </CardActions>
          </Card>
    )
}
