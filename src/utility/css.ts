import { css } from "@emotion/css";

export const selectableRange = css`
	padding-top: 0;
`;

export const wizardPage = css`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;

	min-height: 250px;
`;

export const grid = (players: number) => css`
	display: grid;
	grid-template-columns: 12em repeat(${players}, 1fr);
	grid-template-rows: repeat(5, 4em);
	width: 100%;
	place-items: center normal;
`;

export const error = css`
	--background: transparent;
	--border-color: transparent;
	--padding-top: 0;
	--padding-bottom: 0;
	--min-height: min-content;
`;
