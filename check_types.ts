
import { Prisma } from '@prisma/client';

type Test = Prisma.BookSectionInclude;
// If this errors or doesn't have church, we know the client is stale.
const test: Test = {
    church: true
};
