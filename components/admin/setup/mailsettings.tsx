"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { toast } from "sonner";

export default function MailSettings() {
  const [mailHost, setMailHost] = React.useState("");
  const [mailPort, setMailPort] = React.useState(587);
  const [mailUser, setMailUser] = React.useState("");
  const [mailPass, setMailPass] = React.useState("");
  const [mailFrom, setMailFrom] = React.useState("");

  const [region, setMailgunRegion] = React.useState("");
  const [mailDomain, setMailDomain] = React.useState("");
  const [mailApiKey, setMailApiKey] = React.useState("");

  function smtpSubmit(e: React.FormEvent) {
    e.preventDefault();

    const config = fetch("/api/config/setMailConfig", {
      method: "POST",
      body: JSON.stringify({
        mailHost,
        mailPort,
        mailUser,
        mailPass,
        mailFrom,
      }),
    });
    toast.promise(config, {
      loading: "Saving...",
      success: "Saved!",
      error: "Error saving mail config",
    });
  }

  function mailgunSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!region) {
      toast.error("Please select a region");
      return;
    }
    const config = fetch("/api/config/setMailgunconfig", {
      method: "POST",
      body: JSON.stringify({
        mailDomain,
        mailApiKey,
        region,
      }),
    });
    toast.promise(config, {
      loading: "Saving...",
      success: "Saved!",
      error: "Error saving Mailgun config",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 w-screen">
        <div>
          <p>Mailgun settings(bulk sending)</p>
          <form
            onSubmit={(e) => mailgunSubmit(e)}
            className="grid grid-rows-2 grid-cols-2 gap-2 w-md border border-slate-100 rounded-lg p-4"
          >
            <Select
              required
              onValueChange={(value) => setMailgunRegion(value)}
              value={region}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Mailgun region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Regions</SelectLabel>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="EU">EU</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              required
              value={mailDomain}
              onChange={(e) => setMailDomain(e.target.value)}
              placeholder="Mailgun domain"
            />
            <Input
              required
              value={mailApiKey}
              onChange={(e) => setMailApiKey(e.target.value)}
              placeholder="Mailgun API key"
              type="password"
            />
            <Button type="submit">Save</Button>
          </form>
        </div>
        <div>
          <p>SMTP settings(for transactional emails)</p>
          <form
            onSubmit={(e) => smtpSubmit(e)}
            className="grid grid-rows-3 grid-cols-2 gap-2 w-md border border-slate-100 rounded-lg p-4"
          >
            <Input
              required
              value={mailHost}
              onChange={(e) => setMailHost(e.target.value)}
              placeholder="SMTP Host"
            />
            <Input
              required
              value={mailPort}
              onChange={(e) => setMailPort(Number(e.target.value))}
              placeholder="SMTP Port"
              type="number"
            />
            <Input
              required
              value={mailUser}
              onChange={(e) => setMailUser(e.target.value)}
              placeholder="SMTP User"
            />
            <Input
              required
              value={mailPass}
              onChange={(e) => setMailPass(e.target.value)}
              placeholder="SMTP Password"
              type="password"
            />
            <Input
              required
              value={mailFrom}
              onChange={(e) => setMailFrom(e.target.value)}
              placeholder="From Email"
              type="email"
            />
            <Button type="submit">Save</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
