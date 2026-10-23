import type { components, paths } from "./api";

type Schemas = components["schemas"];

export type UserResponse = Required<Schemas["UserResponse"]>;
export type UserRegister = Schemas["UserRegister"];
export type LoginRequest = Schemas["LoginRequest"];
export type BasicMeetingResponse = Required<Schemas["BasicMeetingResponse"]>;
export type MeetingResponse = Required<Schemas["MeetingResponse"]>;
export type MeetingParticipantResponse = Required<
  Schemas["MeetingParticipantResponse"]
>;
export type CategoryResponse = Required<Schemas["CategoryResponse"]>;
export type CreateMeetingRequest = Schemas["CreateMeetingRequest"];
export type UpdateMeetingRequest = Schemas["UpdateMeetingRequest"];
export type MeetingReviewRequest = Schemas["MeetingReviewRequest"];
export type MeetingSearchRequest = NonNullable<
  paths["/api/Meeting/search"]["get"]["parameters"]["query"]
>;
