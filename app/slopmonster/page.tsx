"use client"
import SlopMonster from "@/app/n/1/page.mdx"
import Link from "next/link"

export default function Slop() {
	return (
		<div className="p-5">
			<div className="flex justify-end">
				<Link href="/" aria-label="Back to home" className="group">
					<svg width="110" height="120" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg"
						className="opacity-70 group-hover:opacity-100 group-hover:-translate-x-3 transition-all duration-500 ease-in-out"
					>
						<line x1="200" y1="120" x2="8" y2="120" stroke="currentColor" strokeWidth="3"/>
						<polyline points="80,20 8,120 80,220" fill="none" stroke="currentColor" strokeWidth="3"/>
					</svg>
				</Link>
			</div>
			<SlopMonster />
		</div>
	)
}
