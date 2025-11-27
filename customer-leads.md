```
model Customer {
  id               String        @id @default(uuid())
  avatar           String?
  firstName        String        @map("first_name")
  lastName         String        @map("last_name")
  email            String?       @unique
  phone            String?
  alternatePhone   String?       @map("alternate_phone")
  dateOfBirth      DateTime?     @map("date_of_birth")
  gender           String?
  nationality      String?
  passportNumber   String?       @unique @map("passport_number")
  passportExpiry   DateTime?     @map("passport_expiry")
  address          String?
  city             String?
  country          String?
  type             CustomerType  @default(INDIVIDUAL)
  companyName      String?       @map("company_name")
  gstNumber        String?       @map("gst_number")

  leads            Lead[]
  documents        CustomerDocument[]

  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  @@index([phone])
  @@index([passportNumber])
  @@map("customers")
}
```

````


enum LeadType {
  B2C
  B2B - Corporate
  B2B - Agency
}

enum LeadStatus {
  NEW
  FOLLOW_UP
  POTENTIAL
  POSITIVE
  CONVERTED
  CLOSED
}

enum LeadPriority {
  LOW
  MEDIUM
  HIGH
}

enum LogType {
  CALL
  EMAIL
  MEETING
  WHATSAPP
}

enum TaskStatus {
  PENDING
  DONE
}

enum LeadSource {

}

model Lead {
  id                  String       @id @default(uuid())
  leadCode            String       @unique @map("lead_code")
  customerId          String       @map("customer_id")
  assignedToId        String?      @map("assigned_to_id")
  leadType            LeadType     @map("lead_type")
  leadSource          LeadSource   @map("lead_source")
  status              LeadStatus
  priority            LeadPriority?

  travelFrom          String?      @map("travel_from")
  travelTo            String?      @map("travel_to")
  travelStart         DateTime?    @map("travel_start")
  travelEnd           DateTime?    @map("travel_end")
  numberOfDays        Int?         @map("number_of_days")
  numberOfTravellers  Int?         @map("number_of_travellers") // Maybe we can add a new model for this since we need to get details for adults children (2-11) and infants (0-2)

  email               String?
  phone               String?

  notes               LeadNote[]
  logs                LeadLog[]
  tasks               LeadTask[]

  customer            Customer     @relation(fields: [customerId], references: [id])

  createdAt           DateTime     @default(now()) @map("created_at")
  updatedAt           DateTime     @updatedAt @map("updated_at")

  @@index([customerId])
  @@index([status])
  @@index([assignedToId, status])
  @@index([createdAt])
  @@index([travelTo, travelStart])
  @@map("leads")
}

model LeadNote {
  id         String   @id @default(uuid())
  leadId     String   @map("lead_id")
  content    String
  createdBy  String   @map("created_by")
  lead       Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now()) @map("created_at")

  @@index([leadId])
  @@map("lead_notes")
}

model LeadLog {
  id         String   @id @default(uuid())
  leadId     String   @map("lead_id")
  type       LogType
  message    String?
  nextAction DateTime? @map("next_action")
  loggedBy   String   @map("logged_by")
  lead       Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now()) @map("created_at")

  @@index([leadId, type])
  @@index([nextAction])
  @@map("lead_logs")
}

model LeadTask {
  id         String     @id @default(uuid())
  leadId     String     @map("lead_id")
  title      String
  dueDate    DateTime?  @map("due_date")
  status     TaskStatus @default(PENDING)
  assignedTo String?    @map("assigned_to")
  lead       Lead       @relation(fields: [leadId], references: [id], onDelete: Cascade)
  createdAt  DateTime   @default(now()) @map("created_at")
  updatedAt  DateTime   @updatedAt @map("updated_at")

  @@index([leadId, status])
  @@index([dueDate])
  @@map("lead_tasks")
}
            ```
````
