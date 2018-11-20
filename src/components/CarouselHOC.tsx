import * as React from 'react'
import { Carousel } from './Carousel'
export class CarouselHOC extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }
    render() {
        return(
            <div>
                <Carousel/>
            </div>
        )
    }

}