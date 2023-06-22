import { render, screen } from "@testing-library/react"
import Home from "./index";

describe('Renders <Home />', () => {
	test('Render', () => {
		render(<Home />);
		const getRecentsPosts = screen.getByText(/Recent Posts/i);

		expect(getRecentsPosts).toBeInTheDocument()
	})
})