import { Ticket } from "../entities/ticket.entity";
import { Record } from "../entities/record.entity";
import { createDateFromFormat } from "src/common/helpers/commons.helpers";

export const FindAllTicketsSerializer = (data: Ticket[]) => {

    let temp = [];

    data.forEach(ticket => {
        const { id, fullName, document, ...restCreatorData } = ticket.creator;

        const records = ticket.records ?? [];

        temp.push({
            id: ticket.id,
            title: ticket.title,
            body: ticket.body,
            creator: { fullName, document },
            status: {
                code: ticket.status?.code,
                name: ticket.status?.name
            },
            type: {
                code: ticket.type?.code,
                name: ticket.type?.name,
            },
            createdAt: createDateFromFormat(ticket.createdAt),
            // records: records.filter((record, index) => index < 2)
            records: TicketRecordsSerializer(records)
        });
    });

    return temp;
}


export const TicketRecordsSerializer = (records: Record[]) => {

    let temp = [];

    records.forEach(record => {
        console.log({record});
        
        const { name, code } = record.type;

        temp.push({
            id: record.id,
            title: record.title,
            body: record.body,
            type: { name, code },
            createdAt: createDateFromFormat(record.createdAt)
        });
    });


    return temp;

}