import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai/index";
import { hinterAtom } from "@/components/search/atoms.ts";


export function TransTable() {
  const [hint] = useAtom(hinterAtom);
  return (hint?.length>0 &&
    <Table>
      <TableCaption>A list of entered input values.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Key</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hint.map((input) => (
          <TableRow key={input[0]}>
            <TableCell className="font-medium">{input[0]}</TableCell>
            <TableCell>{input[1]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
