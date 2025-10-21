"use client"

import { toast } from "sonner";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type BulkProvider = "mailgun" | "aws-ses" | "sendgrid" | "maileroo" | "brevo";

interface FormData {
	bulkProvider: BulkProvider;
	mailgunRegion: string;
	mailgunDomain: string;
	mailgunApiKey: string;
	awsAccessKey: string;
	awsSecretKey: string;
	awsRegion: string;
	sendgridApiKey: string;
	mailerooApiKey: string;
	brevoApiKey: string;
	smtpHost: string;
	smtpPort: string;
	smtpUser: string;
	smtpPassword: string;
	fromEmail: string;
}

export function MailSettings() {
	const [formData, setFormData] = useState<FormData>({
		bulkProvider: "mailgun",
		mailgunRegion: "us",
		mailgunDomain: "",
		mailgunApiKey: "",
		awsAccessKey: "",
		awsSecretKey: "",
		awsRegion: "us-east-1",
		sendgridApiKey: "",
		mailerooApiKey: "",
		brevoApiKey: "",
		smtpHost: "",
		smtpPort: "587",
		smtpUser: "",
		smtpPassword: "",
		fromEmail: "",
	});

	const [saved, setSaved] = useState(false);

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
	};

	const handleSave = (section: string) => {
		if (section == "bulk") {
			const config = fetch("/api/config/setMailgunconfig", {
				method: "POST",
				body: JSON.stringify({
					mailDomain: formData.mailgunDomain,
					mailApiKey: formData.mailgunApiKey,
					region: formData.mailgunRegion,
				}),
			}).then((res) => {
        setSaved(true);
      });
			toast.promise(config, {
				loading: "Saving...",
				success: "Saved!",
				error: "Error saving Mailgun config",
			});
      
		}
    else if(section == "smtp") {
      const config = fetch("/api/config/setMailConfig", {
        method: "POST",
        body: JSON.stringify({
          mailHost: formData.smtpHost,
          mailPort: Number(formData.smtpPort),
          mailUser: formData.smtpUser,
          mailPass: formData.smtpPassword,
          mailFrom: formData.fromEmail,
        }),
      }).then(() => {
        setSaved(true);
      });
      toast.promise(config, {
        loading: "Saving...",
        success: "Saved!",
        error: "Error saving SMTP config",
      });
    }
    setSaved(true);
	};

	return (
		<div className="space-y-8">
			{/* Bulk Sending Section */}
			<Card className="border border-border bg-card">
				<CardHeader>
					<CardTitle className="text-2xl">Bulk Sending</CardTitle>
					<CardDescription>
						Configure your email provider for bulk and marketing campaigns
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Provider Selection */}
					<div className="space-y-2">
						<Label htmlFor="provider" className="text-base font-semibold">
							Email Provider
						</Label>
						<Select
							value={formData.bulkProvider}
							onValueChange={(value) =>
								handleInputChange("bulkProvider", value as BulkProvider)
							}
						>
							<SelectTrigger id="provider" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="mailgun">Mailgun</SelectItem>

                { /* Feeling too lazy to implement other providers right now */ }

								{/* <SelectItem value="aws-ses">AWS SES</SelectItem>
								<SelectItem value="sendgrid">SendGrid</SelectItem>
								<SelectItem value="maileroo">Maileroo</SelectItem>
								<SelectItem value="brevo">Brevo</SelectItem> */}
							</SelectContent>
						</Select>
					</div>

					{/* Mailgun Fields */}
					{formData.bulkProvider === "mailgun" && (
						<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="mailgun-region">Region</Label>
									<Select
										value={formData.mailgunRegion}
										onValueChange={(value) =>
											handleInputChange("mailgunRegion", value)
										}
									>
										<SelectTrigger id="mailgun-region">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="us">US</SelectItem>
											<SelectItem value="eu">EU</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="mailgun-domain">Domain</Label>
									<Input
										id="mailgun-domain"
										placeholder="mg.example.com"
										value={formData.mailgunDomain}
										onChange={(e) =>
											handleInputChange("mailgunDomain", e.target.value)
										}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="mailgun-key">API Key</Label>
								<Input
									id="mailgun-key"
									type="password"
									placeholder="xxxx"
									value={formData.mailgunApiKey}
									onChange={(e) =>
										handleInputChange("mailgunApiKey", e.target.value)
									}
								/>
							</div>
						</div>
					)}

					{/* AWS SES Fields */}
					{formData.bulkProvider === "aws-ses" && (
						<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="aws-region">Region</Label>
									<Select
										value={formData.awsRegion}
										onValueChange={(value) =>
											handleInputChange("awsRegion", value)
										}
									>
										<SelectTrigger id="aws-region">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="us-east-1">
												US East (N. Virginia)
											</SelectItem>
											<SelectItem value="us-west-2">
												US West (Oregon)
											</SelectItem>
											<SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
											<SelectItem value="ap-southeast-1">
												Asia Pacific (Singapore)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="aws-access">Access Key ID</Label>
								<Input
									id="aws-access"
									type="password"
									placeholder="AKIAIOSFODNN7EXAMPLE"
									value={formData.awsAccessKey}
									onChange={(e) =>
										handleInputChange("awsAccessKey", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="aws-secret">Secret Access Key</Label>
								<Input
									id="aws-secret"
									type="password"
									placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
									value={formData.awsSecretKey}
									onChange={(e) =>
										handleInputChange("awsSecretKey", e.target.value)
									}
								/>
							</div>
						</div>
					)}

					{/* SendGrid Fields */}
					{formData.bulkProvider === "sendgrid" && (
						<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
							<div className="space-y-2">
								<Label htmlFor="sendgrid-key">API Key</Label>
								<Input
									id="sendgrid-key"
									type="password"
									placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
									value={formData.sendgridApiKey}
									onChange={(e) =>
										handleInputChange("sendgridApiKey", e.target.value)
									}
								/>
							</div>
						</div>
					)}

					{/* Maileroo Fields */}
					{formData.bulkProvider === "maileroo" && (
						<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
							<div className="space-y-2">
								<Label htmlFor="maileroo-key">API Key</Label>
								<Input
									id="maileroo-key"
									type="password"
									placeholder="mr_xxxxxxxxxxxxxxxxxxxxxxxx"
									value={formData.mailerooApiKey}
									onChange={(e) =>
										handleInputChange("mailerooApiKey", e.target.value)
									}
								/>
							</div>
						</div>
					)}

					{/* Brevo Fields */}
					{formData.bulkProvider === "brevo" && (
						<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
							<div className="space-y-2">
								<Label htmlFor="brevo-key">API Key</Label>
								<Input
									id="brevo-key"
									type="password"
									placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx"
									value={formData.brevoApiKey}
									onChange={(e) =>
										handleInputChange("brevoApiKey", e.target.value)
									}
								/>
							</div>
						</div>
					)}

					<Button
						onClick={() => handleSave("bulk")}
						className="w-full sm:w-auto"
					>
						{saved ? "Saved!" : "Save Bulk Settings"}
					</Button>
				</CardContent>
			</Card>

			{/* Transactional Email Section */}
			<Card className="border border-border bg-card">
				<CardHeader>
					<CardTitle className="text-2xl">Transactional Email</CardTitle>
					<CardDescription>
						Configure SMTP for transactional and system emails
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="smtp-host">SMTP Host</Label>
							<Input
								id="smtp-host"
								placeholder="smtp.example.com"
								value={formData.smtpHost}
								onChange={(e) => handleInputChange("smtpHost", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="smtp-port">Port</Label>
							<Input
								id="smtp-port"
								placeholder="587"
								value={formData.smtpPort}
								onChange={(e) => handleInputChange("smtpPort", e.target.value)}
							/>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="smtp-user">Username</Label>
							<Input
								id="smtp-user"
								placeholder="your-email@example.com"
								value={formData.smtpUser}
								onChange={(e) => handleInputChange("smtpUser", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="smtp-password">Password</Label>
							<Input
								id="smtp-password"
								type="password"
								placeholder="••••••••"
								value={formData.smtpPassword}
								onChange={(e) =>
									handleInputChange("smtpPassword", e.target.value)
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="from-email">From Email Address</Label>
						<Input
							id="from-email"
							type="email"
							placeholder="noreply@example.com"
							value={formData.fromEmail}
							onChange={(e) => handleInputChange("fromEmail", e.target.value)}
						/>
					</div>

					<Button
						onClick={() => handleSave("smtp")}
						className="w-full sm:w-auto"
					>
						{saved ? "Saved!" : "Save SMTP Settings"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
