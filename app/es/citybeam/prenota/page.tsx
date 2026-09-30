import { RequestPage } from '../../../citybeam/booking-ui';
import styles from '../../../citybeam/booking.css?inline';
export const metadata={title:'Solicita tu campaña | CityBeam',alternates:{canonical:'https://www.kreluna.it/es/citybeam/prenota'}};
export default function Page(){return <><style dangerouslySetInnerHTML={{__html:styles}}/><RequestPage locale="es"/></>;}
