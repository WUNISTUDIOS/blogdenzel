"use client"
import InitShader from "@/components/initShader"
import { NameTransition } from "../name"
import Link from "next/link"

export default function WebShader() {
	return (
		<div className="fixed inset-0">
			<InitShader />
			<div className="absolute top-0 left-0 p-8">
				<NameTransition />
			</div>
			<div className="absolute top-0 right-0 p-8 flex justify-center">
				<Link href="/" aria-label="Back to home" className="group">
					<svg
						width="110"
						height="120"
						viewBox="0 0 220 240"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-white opacity-70 group-hover:opacity-100 group-hover:-translate-x-3 transition-all duration-500 ease-in-out"
					>
						<line x1="200" y1="120" x2="8" y2="120" stroke="currentColor" strokeWidth="3"/>
						<polyline points="80,20 8,120 80,220" fill="none" stroke="currentColor" strokeWidth="3"/>
					</svg>
				</Link>
			</div>
		</div>
	)
}
