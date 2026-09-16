import {
  ArrowRight,
  Mail,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { membersService } from "../services/members.service";
import type { Member } from "../types/member.types";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await membersService.getMembers();

        setMembers(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load members.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return members;
    }

    return members.filter((member) => {
      const fullName =
        `${member.first_name} ${member.last_name ?? ""}`.toLowerCase();

      return (
        fullName.includes(search) ||
        member.member_code.toLowerCase().includes(search) ||
        member.phone?.toLowerCase().includes(search) ||
        member.email?.toLowerCase().includes(search)
      );
    });
  }, [members, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Users className="h-4 w-4" />
            Members
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gym Members
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your gym members and their membership information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/members/new")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              All Members
            </h2>

            {!loading && (
              <p className="mt-1 text-xs text-slate-500">
                {filteredMembers.length}{" "}
                {filteredMembers.length === 1
                  ? "member"
                  : "members"}
              </p>
            )}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search members..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Loading members...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we fetch your member list.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          members.length === 0 && (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Users className="h-6 w-6 text-slate-400" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">
                No members yet
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Add your first gym member to start managing
                memberships and subscriptions.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard/members/new")
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </button>
            </div>
          )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          members.length > 0 &&
          filteredMembers.length === 0 && (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-5 w-5 text-slate-400" />
              </div>

              <h2 className="mt-3 text-sm font-semibold text-slate-900">
                No members found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try searching with a different name, phone number,
                email, or member code.
              </p>
            </div>
          )}

        {/* Members Table */}
        {!loading &&
          !error &&
          filteredMembers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member Code
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Join Date
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => {
                    const fullName =
                      `${member.first_name} ${member.last_name ?? ""}`.trim();

                    return (
                      <tr
                        key={member.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        {/* Member */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/dashboard/members/${member.id}`,
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                              {member.first_name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 group-hover:text-primary">
                                {fullName}
                              </p>

                              {member.email && (
                                <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                                  {member.email}
                                </p>
                              )}
                            </div>
                          </button>
                        </td>

                        {/* Member Code */}
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600">
                            {member.member_code}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {member.phone ? (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                <span>{member.phone}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}

                            {member.email && (
                              <div className="flex max-w-[220px] items-center gap-2 truncate text-xs text-slate-500">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">
                                  {member.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="px-5 py-4 text-slate-600">
                          {member.join_date}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
                              "text-xs font-semibold",
                              member.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : member.status === "blocked"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-1.5 w-1.5 rounded-full",
                                member.status === "active"
                                  ? "bg-emerald-500"
                                  : member.status === "blocked"
                                    ? "bg-red-500"
                                    : "bg-slate-400",
                              ].join(" ")}
                            />

                            {member.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/dashboard/members/${member.id}`,
                              )
                            }
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}