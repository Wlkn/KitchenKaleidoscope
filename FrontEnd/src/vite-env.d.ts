/// <reference types="vite/client" />


declare module '../components/navbar' {
    export interface NavbarProps {  
        title: string;
        showSearch: boolean;
    }
    export default function Navbar(props: NavbarProps): JSX.Element;
}