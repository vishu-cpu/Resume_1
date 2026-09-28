import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/types";

const s = StyleSheet.create({
  page: { padding: 42, fontFamily: "Helvetica", color: "#202938", fontSize: 9, lineHeight: 1.4 },
  name: { fontSize: 25, fontWeight: 700, color: "#17233a" },
  role: { marginTop: 3, fontSize: 10, color: "#315fb8", fontWeight: 700 },
  contact: { marginTop: 7, color: "#657188", fontSize: 8 },
  section: { marginTop: 14 },
  heading: { fontSize: 8, color: "#315fb8", fontWeight: 700, letterSpacing: 1.2, borderBottomWidth: 1, borderBottomColor: "#d9e2f0", paddingBottom: 3, marginBottom: 6 },
  text: { color: "#4b5563", fontSize: 8.5 },
  item: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  bold: { fontWeight: 700, fontSize: 8.5 },
  sub: { color: "#667085", fontSize: 8, marginTop: 2 },
  bullet: { marginLeft: 10, color: "#4b5563", fontSize: 8, marginTop: 2 }
});

const lines = (v: string) => v.split(/\n|•|;/).map(x => x.trim()).filter(Boolean);

export function ResumePdf({ data }: { data: ResumeData }) {
  return (
    <Document title={`${data.name} Resume`} author="ResumeCraft">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{data.name}</Text>
        {data.role && <Text style={s.role}>{data.role}</Text>}
        <Text style={s.contact}>
          {[data.location, data.phone, data.email].filter(Boolean).join("  •  ")}
          {data.linkedin ? `  •  ${data.linkedin}` : ""}
          {data.github ? `  •  ${data.github}` : ""}
          {data.website ? `  •  ${data.website}` : ""}
        </Text>

        {data.summary && <View style={s.section}><Text style={s.heading}>PROFESSIONAL SUMMARY</Text><Text style={s.text}>{data.summary}</Text></View>}

        {data.skills && <View style={s.section}><Text style={s.heading}>SKILLS</Text><Text style={s.text}>{lines(data.skills).join("  •  ")}</Text></View>}

        {data.experiences.some(x => x.company || x.role || x.description) && (
          <View style={s.section}>
            <Text style={s.heading}>EXPERIENCE</Text>
            {data.experiences.filter(x => x.company || x.role || x.description).map((x, i) => (
              <View style={s.item} key={i}>
                <View style={s.row}>
                  <Text style={s.bold}>{x.role}{x.company ? ` — ${x.company}` : ""}</Text>
                  <Text style={s.sub}>{[x.start, x.end].filter(Boolean).join(" – ")}</Text>
                </View>
                {x.location && <Text style={s.sub}>{x.location}</Text>}
                {lines(x.description).map((b, j) => <Text style={s.bullet} key={j}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {data.education.some(x => x.institution || x.field || x.grade) && (
          <View style={s.section}>
            <Text style={s.heading}>EDUCATION</Text>
            {data.education.filter(x => x.institution || x.field || x.grade).map((x, i) => (
              <View style={s.item} key={i}>
                <View style={s.row}>
                  <Text style={s.bold}>{x.level}{x.field ? ` — ${x.field}` : ""}</Text>
                  <Text style={s.sub}>{[x.start, x.end].filter(Boolean).join(" – ")}</Text>
                </View>
                <Text style={s.sub}>{x.institution}{x.grade ? `  •  ${x.grade}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {data.achievements && <View style={s.section}><Text style={s.heading}>ACHIEVEMENTS</Text>{lines(data.achievements).map((x,i)=><Text style={s.bullet} key={i}>• {x}</Text>)}</View>}
        {data.certifications && <View style={s.section}><Text style={s.heading}>CERTIFICATIONS</Text>{lines(data.certifications).map((x,i)=><Text style={s.bullet} key={i}>• {x}</Text>)}</View>}
        {data.languages && <View style={s.section}><Text style={s.heading}>LANGUAGES</Text><Text style={s.text}>{data.languages}</Text></View>}
        {(data.hobbies || data.expectedSalary || data.noticePeriod) && (
          <View style={s.section}>
            <Text style={s.heading}>ADDITIONAL DETAILS</Text>
            {data.hobbies && <Text style={s.text}>Hobbies: {data.hobbies}</Text>}
            {data.expectedSalary && <Text style={s.text}>Expected salary: {data.expectedSalary}</Text>}
            {data.noticePeriod && <Text style={s.text}>Notice period: {data.noticePeriod}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
}
