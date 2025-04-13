
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Nunito', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'card-flip': {
					'0%': {
						transform: 'rotateY(0deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'rotateY(180deg)',
						opacity: '0.9'
					}
				},
				'card-hover': {
					'0%': {
						transform: 'translateY(0) rotate(0deg)',
						boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
					},
					'50%': {
						transform: 'translateY(-5px) rotate(2deg)',
						boxShadow: '0 15px 25px rgba(0,0,0,0.3)'
					},
					'100%': {
						transform: 'translateY(0) rotate(0deg)',
						boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'card-flip': 'card-flip 0.5s ease-out forwards',
				'card-hover': 'card-hover 0.8s ease-in-out'
			},
			boxShadow: {
				'card-normal': '0 5px 15px rgba(0,0,0,0.2)',
				'card-hover': '0 15px 25px rgba(0,0,0,0.3)',
				'card-glow': '0 0 15px rgba(66, 153, 225, 0.5), 0 0 30px rgba(66, 153, 225, 0.3)',
				'sidebar': '5px 0 25px rgba(0,0,0,0.25)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'card-texture': 'linear-gradient(45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%, transparent 50%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0.05) 75%, transparent 75%, transparent)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
