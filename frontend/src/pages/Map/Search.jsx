import usePlacesAutocomplete, {
	getGeocode,
	getLatLng
} from "use-places-autocomplete";

import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Search({ panTo }) {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions
	} = usePlacesAutocomplete({
		requestOptions: {
			location: { lat: () => 22.396427, lng: () => 114.109497 },
			radius: 40 * 1000
		}
	});

	return (
		<Combobox
			className="absolute left-0 right-0 z-10 mx-auto mt-2 w-3/5"
			onSelect={async (address) => {
				setValue(address, false);
				clearSuggestions();

				try {
					const results = await getGeocode({ address });
					const { lat, lng } = await getLatLng(results[0]);
					panTo({ lat, lng });
				} catch (err) {
					console.log(err);
				}
			}}
		>
			<ComboboxInput
				className="w-full text-2xl"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				disabled={!ready}
				placeholder="Enter an address"
			/>
			<ComboboxPopover>
				<ComboboxList>
					{status === "OK" &&
						data.map(({ place_id, description }) => {
							return (
								<ComboboxOption
									key={place_id}
									value={description}
								/>
							);
						})}
				</ComboboxList>
			</ComboboxPopover>
		</Combobox>
	);
}
