import {SvgIcon} from "@mui/material";

export function LassoIcon(props) {
    return <SvgIcon {...props}>
        <svg fill="none"
             strokeWidth="1.5"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
             strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M7 22a5 5 0 01-2-4"></path>
            <path d="M3.3 14A6.8 6.8 0 012 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 01-5-1"></path>
            <path d="M5 18a2 2 0 100-4 2 2 0 000 4z"></path>
        </svg>
    </SvgIcon>
}

export function ShiftIcon(props) {
    return <SvgIcon {...props}>
        <svg fill="none"
             strokeWidth="1.5"
             stroke="currentColor"
             viewBox="1 1 23 23"
             xmlns="http://www.w3.org/2000/svg"
             strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M7 22a5 5 0 01-2-4"></path>
            <path d="M3.3 14A6.8 6.8 0 012 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 01-5-1"></path>
            <path d="M5 18a2 2 0 100-4 2 2 0 000 4z"></path>
            <text x="12" y="11"
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" strokeWidth="0"
                  fill="currentColor">
                Shift
            </text>
        </svg>
    </SvgIcon>
}