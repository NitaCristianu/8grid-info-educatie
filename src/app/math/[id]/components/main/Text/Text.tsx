"use client"
import { useAtom } from "jotai"
import { labels_data } from '../../../data/elements';
import Label from "./Label";

export default function Text(props : {isEditable? : boolean}) {
    const [labels, set_labels] = useAtom(labels_data);
    return (<>
        {...labels.map(data => <Label isEditable={props.isEditable} id = {data.id} key={data.id} />)}
    </>)
}